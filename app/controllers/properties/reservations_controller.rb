module Properties
  class ReservationsController < ApplicationController
    before_action :set_property, :authenticate_user!

    def new
      @reservation = @property.reservations.new # new_reservation_params
    end

    private

    def set_property
      @property = Property.find params[:property_id]
    end

    def new_reservation_params
      params.permit(:checkin_date, :checkout_date, :subtotal, :cleaning_fee, :service_fee, :total)
    end
  end
end