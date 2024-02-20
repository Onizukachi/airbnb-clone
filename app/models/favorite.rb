class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :property

  validates_uniqueness_of :user_id, scope: :property_id
end
