require 'rubygems'
require 'sinatra'
require './lib/store'
require 'json/ext'

get '/' do
  erb :index
end

get '/api/nodes' do
  bson = BSON::OrderedHash.new #for ruby 1.8
  bson[:geoNear] = 'nodes'
  bson[:near] = [params[:x].to_f, params[:y].to_f]
  bson[:spherical] = true
  bson[:num] = 300
  nodes = Store.database.command(bson)
  JSON.generate(nodes['results'].map{|n| n['obj']})
end
