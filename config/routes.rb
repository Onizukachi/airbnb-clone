require 'sidekiq/web'

Rails.application.routes.draw do
  devise_for :users
  mount Sidekiq::Web => "/sidekiq"

  get "up" => "rails/health#show", as: :rails_health_check

  root "home#index"

  namespace :api do
    get "/users_by_email" => "users_by_emails#show", as: :users_by_email
    resources :favorites, only: %i[create destroy]
  end

  resources :properties, only: :show do
    resources :reservations, only: %i[new], controller: 'properties/reservations'
  end
end
