require 'mongo'

module Store  
  def self.setup
    @@mongo_connection = Mongo::Connection.new
    @@mongo_database = @@mongo_connection.db('pots')
    handle_passenger_forking
  end
  
  def self.database
    @@mongo_database
  end
  def self.mongo_collections
    @@mongo_database.collections
  end
  
  def self.[](collection_name)
    @@mongo_database.collection(collection_name)
  end
  
  def self.handle_passenger_forking
    if defined?(PhusionPassenger)
      PhusionPassenger.on_event(:starting_worker_process) do |forked|
        @@mongo_connection.connect if forked
      end
    end
  end
end