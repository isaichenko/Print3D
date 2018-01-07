class ArticlesController < ApplicationController
  before_action :logged_in_user,  only: [:new, :create, :edit, :update, :destroy]
  before_action :admin_user,     only: [:new, :create, :edit, :update, :destroy]
  
  def index
    @articles = Article.paginate(:page => params[:page], :per_page => 5)
    #@articles = Article.order("created_at DESC")
  end

  def show
    @article = Article.find(params[:id])
  end

  def new
    @article = Article.new
  end

  def edit
    @article = Article.find(params[:id])
  end

  def create
    @article = current_user.articles.build(article_params)
    if @article.save
      flash[:success] = "Статья успешно создана!"
      redirect_to @article
    else
      flash[:alert] = "Ошибка! Статья не создана!"
      render 'new'
    end
  end

  def update
    @article = Article.find(params[:id])

    if @article.update(article_params)
      flash[:notice] = "Статья успешно обновлена!"
      redirect_to @article
    else
      flash[:alert] = "Ошибка обновления статьи!"
      render 'edit'
    end
  end

  def destroy
    @article = Article.find(params[:id])
    @article.destroy

    redirect_to articles_path
  end

  private

    def article_params
      params.require(:article).permit(:title, :content)
    end
end
