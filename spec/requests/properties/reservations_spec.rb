require 'rails_helper'

RSpec.describe "Properties::Reservations", type: :request do
  let!(:user) { create(:user) }
  let!(:property) { create(:property) }

  before { sign_in user }

  describe "GET /new" do
    it "succeeds" do
      get new_property_reservation_path(property)
      expect(response).to be_successful
    end
  end
end
