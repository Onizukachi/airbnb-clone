class AddUniqIndexToFavorites < ActiveRecord::Migration[7.1]
  def change
    add_index :favorites, [:user_id, :property_id], unique: true
  end
end
