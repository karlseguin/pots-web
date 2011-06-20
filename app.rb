require 'rubygems'
require 'sinatra'
require './lib/store'
require 'json/ext'

get '/' do
  erb :index
end

get '/api/nodes' do
   nodes = Store.database.command({:geoNear => 'nodes', :near => [params[:x].to_f, params[:y].to_f], :spherical => true, :num => 300})
   JSON.generate(nodes['results'].map{|n| n['obj']})
end
