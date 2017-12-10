Rails.application.routes.draw do
  root 'static_pages#home'
  get  '/your_model', to: 'static_pages#your_model'
  get  '/about',      to: 'static_pages#about'
  get  '/contact',    to: 'static_pages#contact'
end
