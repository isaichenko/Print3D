class CallBacksController < ApplicationController
  
  def new
    @callback = CallBack.new
  end

  def create
    @callback = CallBack.new(callback_params)
    @callback.request = request
    if verify_recaptcha(model: @callback) && @callback.deliver
      flash.now[:success] = 'Спасибо за Ваш запрос. Мы обязательно перезвоним в ближайшее время!'
    else
      flash.now[:danger] = 'Не удалось выполнить запрос.'
      render 'new'
    end
  end

  private
    def callback_params
      params.require(:call_back).permit(:name, :email, :phone, :message, :captcha)
    end
end
