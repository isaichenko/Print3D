class Contact < MailForm::Base
  attribute :name,      :validate => true
  attribute :email,     :validate => /\A([\w\.%\+\-]+)@([\w\-]+\.)+([\w]{2,})\z/i
  attribute :file,      :attachment => true, :validate => :file_size_validation,
  :validate =>  :file_format
  #:validate => /\.(png|PNG|jpg|JPG|jpeg|JPEG|stl|STL|zip|ZIP|rar|RAR|tar|TAR|gz|GZ|a3d|A3D)\Z/, 
  #:message => "error. Формат файла не поддерживается. Используйте stl или файл картинки"
  #:validate => /\.(png|PNG|jpg|JPG|jpeg|JPEG|docx|DOCX|pdf|PDF)\Z/
  attribute :phone,     :validate => true

  attribute :message
  #attribute :nickname,  :captcha  => true

  # Declare the e-mail headers. It accepts anything the mail method
  # in ActionMailer accepts.
  def headers
    {
      :subject => "Новый контакт на сайте",
      :to => "clashinua@gmail.com",
      :from => %("#{name}" <#{email}>)
    }
  end

  private
    def file_size_validation
      errors[:file] << "должен быть меньше чем 5Mb" if file.size > 10.megabytes
    end

    def file_format
      errors[:file] << "пипец расширение" if File.extname(file) != /\.(png|PNG|jpg|JPG|jpeg|JPEG)\Z/
    end

end
