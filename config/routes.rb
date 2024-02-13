require 'sidekiq/web'

Rails.application.routes.draw do
  devise_for :users
  mount Sidekiq::Web => "/sidekiq"

  get "up" => "rails/health#show", as: :rails_health_check

  root "home#index"

  namespace :api do
    resources :users, only: :show
    get "/users_by_email" => "users_by_emails#show", as: :users_by_email
  end
end
