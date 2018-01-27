class CallBack < MailForm::Base
  attribute :name,      :validate => true
  attribute :email,     :validate => /\A([\w\.%\+\-]+)@([\w\-]+\.)+([\w]{2,})\z/i,
                        :allow_blank => true
  attribute :phone, 	  :validate => true

  attribute :message
  attribute :nickname,  :captcha  => true

  # Declare the e-mail headers. It accepts anything the mail method
  # in ActionMailer accepts.
  def headers
    {
      :subject => "Нас просят перезвонить!",
      :to => "factoryoftech.com@gmail.com",
      :from => %("#{name}" <factoryoftech.com@gmail.com>)
    }
  end
end
