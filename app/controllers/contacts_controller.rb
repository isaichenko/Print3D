class ContactsController < ApplicationController
  def new
    @contact = Contact.new
  end

  def create
    @contact = Contact.new(contact_params)
    @contact.request = request
    if @contact.deliver
      flash.now[:success] = 'Спасибо за Ваше сообщение. Мы скоро с Вами свяжемся!'
    else
      flash.now[:danger] = 'Не удалось отправить сообщение.'
      render :new
    end
  end

  private
    def contact_params
      params.require(:contact).permit(:name, :email, :phone, :message, :file, :captcha)
    end
end
