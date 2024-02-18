class AddPriceCentsToProperties < ActiveRecord::Migration[7.1]
  def change
    add_monetize :properties, :price
  end
end
