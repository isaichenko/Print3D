class FileSendsController < ApplicationController
  
  def new
    @filesend = FileSend.new
  end

  def create
    @filesend = FileSend.new(filesend_params)
    @filesend.request = request
    if verify_recaptcha(model: @filesend) && @filesend.deliver
      flash.now[:success] = 'Спасибо за Ваше сообщение. Мы скоро с Вами свяжемся!'
    else
      flash.now[:danger] = 'Не удалось отправить сообщение.'
      render 'new'
    end
  end

  private
    def filesend_params
      params.require(:file_send).permit(:name, :email, :phone, :message, :file, :captcha)
    end
end
