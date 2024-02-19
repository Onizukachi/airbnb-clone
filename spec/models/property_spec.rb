require 'rails_helper'

RSpec.describe Property, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:headline) }
    it { should validate_presence_of(:description) }
    it { should validate_presence_of(:address_1) }
    it { should validate_presence_of(:city) }
    it { should validate_presence_of(:state) }
    it { should validate_presence_of(:country) }
    it { should have_many(:reviews) }
    it { should have_many(:favorites).dependent(:destroy) }
    it { should have_many(:favorited_users).through(:favorites).source(:user) }
  end

  it { is_expected.to monetize(:price_cents).allow_nil }
end
