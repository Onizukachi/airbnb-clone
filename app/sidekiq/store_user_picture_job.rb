require 'open-uri'

class StoreUserPictureJob
  include Sidekiq::Job

  sidekiq_options retry: 3

  def perform(user_id, image_url)
    user = User.find user_id
    uri = URI.parse(image_url)
    image = uri.open
    image_name = "user_picture_#{user.id}"
    user.picture.attach(io: image, filename: image_name)
  end
end
