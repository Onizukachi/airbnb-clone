class Review < ApplicationRecord
  belongs_to :reviewable, polymorphic: true

  validates :title, presence: true
  validates :body, presence: true
  validates :rating, presence: true, numericality: { in: 1..5 }
end
