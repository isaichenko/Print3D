      var need_browser=false;

      if (!(typeof FileReader !== "undefined"))
      {
        need_browser=true;
      }

      var is_ie = !!window.MSStream;
      var waiting=false;
      var mesh=null;
      var material=new THREE.MeshLambertMaterial({color:0x909090, overdraw: 1, wireframe: false, shading:THREE.FlatShading, vertexColors: THREE.FaceColors});
      var mesh_is_ready=false;
      var colored_model=false;

      if (!is_ie)
        //double side not supported on IE
        material.side = THREE.DoubleSide;

      var cancel_download=false;
      var cancel_3dp=false;
      var max_file_size=40000000;
      var mesh_color='#909090';

      var xsize=0;
      var ysize=0;
      var zsize=0;
      var vol=0;
      var area=0;
      var triangles_count=0;
      var model_filename='';
      var view_units=1; //mm
      var file_units=1; //mm
      var bg_color=0xffffff;
      var deg90=Math.PI / 2;
      var orientation="front";
      var egh=null; //for edges
      var has_edges=false;
      var url_is_local=false;

      function $id(id)
      {
        return document.getElementById(id);
      }

      function set_orientation(ovalue)
      {
        orientation=ovalue;
        if (!mesh) return;

        mesh.rotation.x=0;
        mesh.rotation.y=0;
        mesh.rotation.z=0;

        switch (ovalue)
        {
          case "right":
            //right - rotate -90 deg. around axis y
            mesh.rotateY(-deg90);
            break;

          case "left":
            //right - rotate 90 deg. around axis y
            mesh.rotateY(deg90);
            break;

          case "top":
            //top - rotate 90 deg. around axis x
            mesh.rotateX(deg90);
            break;

          case "bottom":
            //top - rotate -90 deg. around axis x
            mesh.rotateX(-deg90);
            break;

          case "back":
            //top - rotate 180 deg. around axis Y
            mesh.rotateY(deg90*2);
            break;

          default:
            //Front / do nothing
        }

        if (mesh_is_ready)
          mesh.geometry.verticesNeedUpdate = true;
      }

      function set_edges(b)
      {
        has_edges=b;
        if (mesh==null) return;
        if (has_edges)
        {
          egh = new THREE.EdgesHelper( mesh, 0x000000 );
          egh.material.linewidth = 1;
          scene.add( egh );
        }
        else
          remove_edges();
      }

      function set_local(b)
      {
        url_is_local=b;
        if (mesh==null) return;
      }

      function remove_edges()
      {
        if (egh) scene.remove( egh );
        egh=null;
      }

      function set_view_units(v)
      {
        view_units=v;
        $id("vunits").innerHTML=v=="1"?"mm":"in";
        setCookie("units", v=="1"?"mm":"in", 1000);
        recalc_units();
      }

      function set_file_units(v)
      {
        file_units=v;
        recalc_units();
      }

      function recalc_units()
      {
                if (file_units==view_units)
          set_vol_and_size(vol, xsize, ysize, zsize);
        else if (file_units==1)
          //file in mm, view in inches
          set_vol_and_size(vol/16387.064, xsize/25.4, ysize/25.4, zsize/25.4);
        else
          //file in inches, view in mm
          set_vol_and_size(vol*16387.064, xsize*25.4, ysize*25.4, zsize*25.4);
              }


      function geo_to_vf(geo)
      {
        var vertices=[];
        var faces=[];

        var len=geo.vertices.length;
        for (i=0;i<len;i++)
          vertices.push([geo.vertices[i].x,geo.vertices[i].y,geo.vertices[i].z]);

        var len=geo.faces.length;
        for (i=0;i<len;i++)
        {
          var a=[geo.faces[i].a,geo.faces[i].b,geo.faces[i].c];
          if (colored_model)
            a.push({r:geo.faces[i].color.r,g:geo.faces[i].color.g,b:geo.faces[i].color.b});

          faces.push(a);
        }


        //console.log(faces);
        return ({vertices:vertices, faces:faces});
      }

      function do_resize()
      {
        var height = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
        var width = isNaN(window.innerWidth) ? window.clientWidth : window.innerWidth;
                height=Math.min(height,width-150);
        $id('cjc').style.height=(height-220)+'px';
        $id('cjc').style.width=(height-220)+'px';
        $id('cjcwrap').style.height=(height-220)+'px';
        $id('cjcwrap').style.width=(height-220)+'px';
        $id('cjcdrag').style.top=((height-320)/2)+'px';
        $id('cjcdrag').style.left=((height-570)/2)+'px';
        $id('cjcpbar').style.top=((height-345)/2)+'px';
        $id('cjcpbar').style.left=((height-570)/2)+'px';
        $id('cjcproc').style.top=((height-345)/2)+'px';
        $id('cjcproc').style.left=((height-570)/2)+'px';

        var rsize_width=$id("cjcwrap").getBoundingClientRect().width;
        var rsize_height=$id("cjcwrap").getBoundingClientRect().height;
        renderer.setSize(rsize_width-5, rsize_height-5);
      }

      function handleDragOver(e)
      {
        if (waiting) return;

        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }

      function handleFileDrop(e)
      {
        e.stopPropagation();
        e.preventDefault();

        if (waiting) return;

        //first, check if its a file
        if (e.dataTransfer.files.length>0)
        {
          if (e.dataTransfer.files[0].size>max_file_size)
          {
            alert('File is too big - maximum allowed size is 35mb');
            return false;
          }

          if (!supported_file_type(e.dataTransfer.files[0].name))
          {
            alert('File type is not supported');
            return false;
          }
          read_file(e.dataTransfer.files[0]);
        }

        else if (typeof e.dataTransfer.getData("Text") === 'string')
        {
          //check - maybe a url?
          read_from_url(e.dataTransfer.getData("Text"));
        }
      }

      function supported_file_type (filename)
      {
        switch (filename.split('.').pop().toLowerCase())
        {
          case 'stl':
          case 'obj':
          case 'vf':
            return true;
            break;

          default:
            return false;
        }

      }

      function switch_view(v)
      {
        $id('cjcdrag').style.display=((v=='drag')?'block':'none');
        $id('cjcpbar').style.display=((v=='pbar')?'block':'none');
        $id('cjcproc').style.display=((v=='proc')?'block':'none');
        $id('cjc').style.display=((v=='cjc')?'block':'none');
      }

      function after_error()
      {
        switch_view('drag');
        cancel_download=false;
        waiting=false;
        return false;
      }


      function after_file_load(filename, s)
      {
        var vf_data;

        try
        {
          vf_data=parse_3d_file(filename, s);
        }
        catch(err)
        {
          vf_data="Error parsing the file";
        }

        if (typeof vf_data === 'string')
        {
          alert(vf_data);
          switch_view('drag');
          waiting=false;
          return;
        }

        mesh_is_ready=false;

        if (mesh!=null) {scene.remove(mesh);mesh=null};

        var geo=new THREE.Geometry;
        geo.vertices=vf_data.vertices;
        geo.faces=vf_data.faces;
        geo.computeBoundingBox();

        geo.computeCentroids();
        geo.computeFaceNormals();
        geo.computeVertexNormals();
        THREE.GeometryUtils.center(geo);
        mesh = new THREE.Mesh(geo, material);


        if (vf_data.colors)
        {
          set_color($id('white_color'),'#FFFFFF');
          colored_model=true;
        }
        else
          colored_model=false;

        update_mesh_color();

        //renderer.setClearColor(bg_color, 0); //background
        set_color(null, bg_color, true); //background

                $id("sel_orientation").selectedIndex=0; //front

        scene.add(mesh);
        mesh_is_ready=true;

        directionalLight.position.x = geo.boundingBox.min.y * 2;
        directionalLight.position.y = geo.boundingBox.min.y * 2;
        directionalLight.position.z = geo.boundingBox.max.z * 2;

        pointLight.position.x = (geo.boundingBox.min.y+geo.boundingBox.max.y)/2;
        pointLight.position.y = (geo.boundingBox.min.y+geo.boundingBox.max.y)/2;
        pointLight.position.z = geo.boundingBox.max.z * 2;

        camera.position.set(0,0,Math.max(geo.boundingBox.max.x*3,geo.boundingBox.max.y*3,geo.boundingBox.max.z*3));
        controls.reset();
        switch_view('cjc');

        if (has_edges) set_edges(true);

        xsize=geo.boundingBox.max.x-geo.boundingBox.min.x;
        ysize=geo.boundingBox.max.y-geo.boundingBox.min.y;
        zsize=geo.boundingBox.max.z-geo.boundingBox.min.z;
        vol_area=calc_vol_and_area(geo);
        vol=vol_area[0];
        area=vol_area[1];
        triangles_count=geo.faces.length;
        model_filename=filename;


                guess_file_units(xsize,ysize,zsize);
        recalc_units();

        $id('ifilename').innerHTML=filename.substr(0,20);
        $id('ifilename').style.visibility='visible';

        setTimeout(function(){$id('statswrap').style.width='280px';$id('statswrap').style.height='auto';}, 500);


        //$id('cjcwrap').addEventListener('dragover', handleDragOver, false);
        //$id('cjcwrap').addEventListener('drop', handleFileDrop, false);

        waiting=false;
      }

      function set_color_by_name(color, is_bg_color)
      {
        is_bg_color=is_bg_color||false;
        switch (color.toLowerCase())
        {
          case "black":   set_color($id('black_color'),'#000000',is_bg_color); break;
          case "white":   set_color($id('white_color'),'#FFFFFF',is_bg_color); break;
          case "blue":    set_color($id('blue_color'),'#0000FF',is_bg_color); break;
          case "green":   set_color($id('green_color'),'#00FF00',is_bg_color); break;
          case "red":     set_color($id('red_color'),'#FF0000',is_bg_color); break;
          case "yellow":    set_color($id('yellow_color'),'#FFFF00',is_bg_color); break;
          case "gray":    set_color($id('gray_color'),'#909090',is_bg_color); break;
          case "azure":   set_color($id('azure_color'),'#00FFFF',is_bg_color); break;
          case "pink":    set_color($id('pink_color'),'#FF00FF',is_bg_color); break;
          case "purple":    set_color($id('purple_color'),'#703487',is_bg_color); break;
          case "darkblue":  set_color($id('darkblue_color'),'#102075',is_bg_color); break;
          case "brown":   set_color($id('brown_color'),'#654321',is_bg_color); break;
          case "transparent": set_color($id('white_color'),'transparent',true); break;
          default:
            //any valid color value goes
            if (/^#[0-9A-F]{6}$/i.test(color))
              set_color($id('white_color'),color,is_bg_color);
        }
      }


      function set_color(o, o_color, is_bg_color)
      {
        is_bg_color=is_bg_color||false;

        if (is_bg_color)
        {
          bg_color=o_color;
          if (o_color=='transparent')
            renderer.setClearColor(0x000000, 0);
          else
            renderer.setClearColor(o_color, 1);
          return;
        }

                c = $id('cpal').getElementsByTagName("div");

        var i=c.length;
        while(i--)
        {
          if (c[i]==o)
            c[i].style.border="2px solid #012101";
          else
            c[i].style.border="2px solid transparent";
        }

        //mesh_color=o.style.background;
        mesh_color=o_color;
        update_mesh_color();
      }


      function update_mesh_color()
      {
        if (mesh==null) return;
        mesh.material.color.set(parseInt(mesh_color.substr(1),16));
      }

      function calc_vol_and_area(geo)
      {
        var x1,x2,x3,y1,y2,y3,z1,z2,z3,i;
        var len=geo.faces.length;
        var totalVolume=0;
        var totalArea=0;
        var a,b,c,s;

        for (i=0;i<len;i++)
        {
          x1=geo.vertices[geo.faces[i].a].x;
          y1=geo.vertices[geo.faces[i].a].y;
          z1=geo.vertices[geo.faces[i].a].z;
          x2=geo.vertices[geo.faces[i].b].x;
          y2=geo.vertices[geo.faces[i].b].y;
          z2=geo.vertices[geo.faces[i].b].z;
          x3=geo.vertices[geo.faces[i].c].x;
          y3=geo.vertices[geo.faces[i].c].y;
          z3=geo.vertices[geo.faces[i].c].z;

          totalVolume +=
            (-x3 * y2 * z1 +
            x2 * y3 * z1 +
            x3 * y1 * z2 -
            x1 * y3 * z2 -
            x2 * y1 * z3 +
            x1 * y2 * z3);

          a=geo.vertices[geo.faces[i].a].distanceTo(geo.vertices[geo.faces[i].b]);
          b=geo.vertices[geo.faces[i].b].distanceTo(geo.vertices[geo.faces[i].c]);
          c=geo.vertices[geo.faces[i].c].distanceTo(geo.vertices[geo.faces[i].a]);
          s=(a+b+c)/2;
          totalArea+=Math.sqrt(s*(s-a)*(s-b)*(s-c));
        }

        return [Math.abs(totalVolume/6), totalArea];
      }

      function numberWithCommas(x)
      {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
      }

      function set_shading(i)
      {
        if (i==2)
          material.wireframe=true;
        else
        {
          material.wireframe=false;
          material.shading=((i==1)?THREE.SmoothShading:THREE.FlatShading);
          if (mesh!=null)
            mesh.geometry.normalsNeedUpdate = true;
        }
      }

      function view_example(ename)
      {
        download_from_local('examples/'+ename, ename);
      }

      function reset()
      {
        if (waiting) return;
        switch_view('drag');
        remove_edges();
        if (mesh!=null) {scene.remove(mesh);mesh=null;}
        $id('fileselect').value='';
      }

      function prepare_upload_file()
      {
        if (waiting) return;
        if ($id('fileselect').value=='') return;

        upload_file($id('fileselect').files[0]);
      }

      function setCookie(cname, cvalue, exdays)
      {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
      }

      function getCookie(cname)
      {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1);
          if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
        }
        return "";
      }

      function guess_file_units(xsize,ysize,zsize)
      {
        //try to guess the file's units (mm or inch?)
        if ((xsize<1)&&(ysize<1)&&(zsize<1))
        {
          file_units=2;
          rin.checked=true;
        }
        else
        {
          file_units=1;
          rmm.checked=true;
        }
      }

      function set_vol_and_size(vol,xsize,ysize,zsize)
      {
        var p=view_units==2?2:0;
        $id('ivol').innerHTML=numberWithCommas(vol.toFixed(p));
        $id('isize').innerHTML=numberWithCommas(xsize.toFixed(p))+' x '+numberWithCommas(ysize.toFixed(p))+' x '+numberWithCommas(zsize.toFixed(p));
      }
