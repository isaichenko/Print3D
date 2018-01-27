class FileSend < MailForm::Base
  attribute :name,      :validate => true
  attribute :email,     :validate => /\A([\w\.%\+\-]+)@([\w\-]+\.)+([\w]{2,})\z/i
  attribute :file,      :attachment => true, :validate => :file_size_type 
  attribute :phone

  attribute :message
  attribute :nickname,  :captcha  => true

  # Declare the e-mail headers. It accepts anything the mail method
  # in ActionMailer accepts.
  def headers
    {
      :subject => "Нам отправили новый файл!",
      :to => "factoryoftech.com@gmail.com",
      :from => %("#{name}" <#{email}>)
    }
  end

  private
    def file_size_type
      if file.present?
        accept_ext = %w( .stl .png .jpg .jpeg .STL )
        errors[:file] << "должен быть меньше чем 5Mb" if file.size > 10.megabytes
        errors[:file] << "не поддерживается" unless accept_ext.include? File.extname(file.original_filename)
      else
        errors[:file] << 'Прикрепите Ваш файл'
      end
    end
end
