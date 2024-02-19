require 'rails_helper'

RSpec.describe "Api::Favorites", type: :request do
  describe "GET show" do
    let(:user) { create(:user) }
    let(:property) { create(:property) }

    before { sign_in user }

    describe "POST create" do
      let(:params) { { property_id: property.id } }

      it "create a new favorite" do
        expect {
          post api_favorites_path, params:, as: :json
        }.to change(Favorite, :count).by(1)

        expect(response.status).to eq 201
      end
    end

    describe "DELETE destroy" do
      let!(:favorite) { create(:favorite) }

      it "delete a favorite" do
        expect {
          delete api_favorite_path(favorite), as: :json
        }.to change(Favorite, :count).by(-1)

        expect(response.status).to eq 204
      end
    end
  end
end
