class Profile < ApplicationRecord
  belongs_to :user

  geocoded_by :address

  after_validation :geocode, if: -> { address_1.present? && longitude.blank? && latitude.blank? }

  def address
    [(address_1 || address_2), city, state, zip_code, country].compact.join(', ')
  end
end
