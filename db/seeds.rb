10.times do |i|
  property = Property.create!(
    name: Faker::Lorem.word,
    headline: Faker::Lorem.sentence,
    description: Faker::Lorem.paragraphs(number: 30).join(" "),
    address_1: Faker::Address.full_address,
    city: Faker::Address.city,
    state: Faker::Address.state,
    country: "United States",
    price: Money.from_amount((20..100).to_a.sample, "USD")
  )

  property.images.attach(io: File.open(Rails.root.join('db', 'sample', 'images', "property_#{i+1}.png")), filename: property.name)

  (1..5).to_a.sample.times do
    Review.create!(reviewable: property, rating: (1..5).to_a.sample, title: Faker::Lorem.word, body: Faker::Lorem.paragraph)
  end
end

