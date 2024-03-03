class Review < ApplicationRecord
  belongs_to :reviewable, polymorphic: true, counter_cache: true
  belongs_to :user

  validates :title, presence: true
  validates :body, presence: true
  validates :rating, presence: true, numericality: { in: 1..5 }

  after_commit :update_average_rating, on: %i[create update destroy]

  private

  def update_average_rating
    average_rating = reviewable.reviews.average(:rating)
    reviewable.update! average_rating:
  end
end
