require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'associations' do
    it { should have_one(:profile) }
    it { should have_many(:favorites).dependent(:destroy) }
    it { should have_many(:favorited_properties).through(:favorites).source(:property) }
    it { should have_many(:reservations).dependent(:destroy) }
    it { should have_many(:reviews).dependent(:destroy) }
    it { should have_many(:reserved_properties).through(:reservations).source(:property) }
  end
end
