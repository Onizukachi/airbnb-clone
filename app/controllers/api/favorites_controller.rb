module Api
  class FavoritesController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :authenticate_user!

    def create
      favorite = Favorite.create! favorite_params

      respond_to do |format|
        format.json do
          render json: serialize_favorite(favorite), status: :created
        end
      end
    end

    def destroy
      favorite = Favorite.find params[:id]
      favorite.destroy!

      respond_to do |format|
        format.json {
          render json: serialize_favorite(favorite), status: 204
        }
      end
    end

    private

    def favorite_params
      params.require(:favorite).permit(:property_id).merge(user_id: current_user.id)
    end

    def serialize_favorite(favorite)
      FavoriteSerializer.new(favorite).serializable_hash[:data].to_json
    end
  end
end