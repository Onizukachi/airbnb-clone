class AddNullConstraintsToReservations < ActiveRecord::Migration[7.1]
  def change
    change_column :reservations, :reservation_date, :date, null: false
  end
end
