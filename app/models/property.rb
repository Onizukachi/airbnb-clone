class Property < ApplicationRecord
  CLEANING_FEE = 5_000.freeze
  CLEANING_FEE_MONEY = Money.new CLEANING_FEE
  SERVICE_FEE_PERCENTAGE = (0.08).freeze

  validates :name, presence: true
  validates :headline, presence: true
  validates :description, presence: true
  validates :address_1, presence: true
  validates :city, presence: true
  validates :state, presence: true
  validates :country, presence: true

  has_many :reviews, as: :reviewable
  has_many_attached :images, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :favorited_users, through: :favorites, source: :user
  has_many :reservations, dependent: :destroy
  has_many :reserved_users, through: :reservations, source: :user

  monetize :price_cents, allow_nil: true

  geocoded_by :address

  after_validation :geocode, if: -> { latitude.blank? && longitude.blank? }

  def address
    # [(address_1 || address_2), city, state, country].compact.join(', ')
    [state, country].compact.join(', ')
  end

  def default_image
    images.first
  end

  def favorited_by?(user)
    return false unless user

    favorited_users.include? user
  end

  def available_dates
    next_reservation = reservations.future_reservations.first
    date_format = "%b %e"

    return Date.tomorrow.strftime(date_format)..(Date.tomorrow + 5.days).strftime(date_format) if !next_reservation || next_reservation.reservation_date > Date.today + 30.days

    Date.tomorrow.strftime(date_format)..next_reservation.reservation_date.strftime(date_format)
  end
end
