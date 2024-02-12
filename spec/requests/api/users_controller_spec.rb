require 'rails_helper'

RSpec.describe "Api::Users", type: :request do
  describe "GET show" do
    context "user exists" do
      it "is successful" do
        user = create(:user)
        get api_user_path(user), as: :json
        expect(response).to be_successful
      end
    end

    context "user does not exists" do
      it "is not found" do
        get api_user_path(id: "junk"), as: :json
        expect(response.status).to eq 404
      end
    end
  end
end