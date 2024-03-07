require 'rails_helper'

RSpec.describe "Properties::Reservations", type: :request do
  let!(:user) { create(:user) }
  let!(:property) { create(:property) }

  before { sign_in user }

  describe "GET /new" do
    it "succeeds" do
      get new_property_reservation_path(property), params: { checkin_date: '07/12/204', checkout_date: '10/12/24' }
      expect(response).to be_successful
    end
  end
end
