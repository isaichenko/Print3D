class Contact < MailForm::Base
  attribute :name,      :validate => true
  attribute :email,     :validate => /\A([\w\.%\+\-]+)@([\w\-]+\.)+([\w]{2,})\z/i
  #attribute :file, :attachment => true, :validate => :file.size > 5.megabytes
  attribute :file,      :attachment => true, :validate => :file_size_validation
  #validates_format_of :file, :file_size_validation
  attribute :phone,     :validate => true

  attribute :message
  attribute :nickname,  :captcha  => true

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
      errors[:file] << "должен быть меньше чем 5Mb" if file.size > 5.megabytes
    end
end
