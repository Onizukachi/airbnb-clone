class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_one :profile, dependent: :destroy

  after_create :create_profile

  def create_profile
    self.profile = Profile.new
  end
end
