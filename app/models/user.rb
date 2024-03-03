class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_one :profile, dependent: :destroy
  has_one_attached :picture, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :favorited_properties, through: :favorites, source: :property
  has_many :reservations, dependent: :destroy
  has_many :reserved_properties, through: :reservations, source: :property
  has_many :reviews, dependent: :destroy

  after_create :create_profile

  def create_profile
    self.profile = Profile.new
  end

  def full_name
    "#{first_name} #{last_name}".squish
  end

  def attach_picture_from_url(url)
    StoreUserPictureJob.perform_async(self.id, url)
  end
end
