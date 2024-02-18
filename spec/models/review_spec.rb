require 'rails_helper'

RSpec.describe Review, type: :model do
  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:body) }
  it { should validate_presence_of(:rating) }
  it { should belong_to(:reviewable) }

  it { should validate_numericality_of(:rating).is_in(1..5) }
end
