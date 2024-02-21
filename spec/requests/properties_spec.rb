require 'rails_helper'

RSpec.describe "Homes", type: :request do
  describe "GET /show" do
    let!(:property) { create(:property) }

    it "succeeds" do
      get property_path(property)
      expect(response).to be_successful
    end
  end
end
