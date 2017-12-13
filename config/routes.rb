Rails.application.routes.draw do
  root 'static_pages#home'
  get  '/your_model', to: 'stl_model#your_model'
  get  '/about',      to: 'static_pages#about'
  get  '/contact',    to: 'static_pages#contact'

  resources :articles do
    resources :comments
  end
end
