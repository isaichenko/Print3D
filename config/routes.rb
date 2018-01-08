Rails.application.routes.draw do
  mount Ckeditor::Engine => '/ckeditor'
  root   'static_pages#home'
  get    '/your_model', to: 'stl_model#your_model'
  get    '/about',      to: 'static_pages#about'
  get    '/contact',    to: 'static_pages#contact'
  get    '/signup', 	  to: 'users#new'
  get    '/login',      to: 'sessions#new'
  post   '/login',      to: 'sessions#create'
  delete '/logout',     to: 'sessions#destroy'
  resources :users
  resources :articles
  
end

