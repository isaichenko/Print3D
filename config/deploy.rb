# config valid for current version and patch releases of Capistrano
lock "~> 3.16.0"

set :rvm_ruby_version, '2.3.1'
set :repo_url, "git@github.com:isaichenko/Print3D.git"

set :user,        'dev'
set :application, "Print3d"

set :environment, 'production'
set :rails_env,   'production'
set :deploy_to,   "/home/#{fetch(:user)}/apps/#{fetch(:application)}"
set :rvm_custom_path, "/usr/share/rvm"
set :pty,         false

set :linked_files,
    fetch(:linked_files, []).push('config/database.yml', 'config/puma.rb', 'config/secrets.yml')
set :linked_dirs,
    fetch(:linked_dirs, []).push('log', 'tmp/cache', 'tmp/pids', 'tmp/sockets', 'vendor/bundle', 'public/system',
                                 'public/uploads', 'public/images', 'storage')

set :config_example_suffix, '.example'
set :config_files, %w[config/database.yml]

set :puma_conf, "#{shared_path}/config/puma.rb"
set :puma_systemctl_bin, '/bin/systemctl'
set :puma_service_unit_name, "puma-#{fetch(:application)}"

set :keep_releases, 5

# set :nginx_use_ssl, false

# set :puma_restart_command, 'sudo systemctl restart puma-kozjin.service'

# set :nginx_ssl_certificate, 'my-domain.crt'
# set :nginx_ssl_certificate_path, "#{shared_path}/ssl/certs"
# set :nginx_ssl_certificate_key, 'my-domain.key'
# set :nginx_ssl_certificate_key_path, "#{shared_path}/ssl/private"

# namespace :sidekiq do
#   task :quiet do
#     on roles(:app) do
#       puts capture("pgrep -f 'sidekiq' | xargs kill -TSTP")
#     end
#   end
#   task :restart do
#     on roles(:app) do
#       execute :sudo, :systemctl, :restart, :sidekiq
#     end
#   end
#   task :status do
#     on roles(:app) do
#       execute :sudo, :systemctl, :status, :sidekiq
#     end
#   end
# end

namespace :setup do
  desc "setup: copy config/secrets.yml to shared/config"
  task :copy_linked_master_key do
    on roles(:app) do
      sudo :mkdir, "-pv", shared_path
      upload! "config/secrets.yml", "#{shared_path}/config/secrets.yml"
      sudo :chmod, "600", "#{shared_path}/config/secrets.yml"
      #upload! "config/credentials.yml.enc", "#{shared_path}/config/credentials.yml.enc"
      #sudo :chmod, "600", "#{shared_path}/config/credentials.yml.enc "
    end
  end
end

namespace :deploy do
  before 'check:linked_files', 'config:push'
  before 'check:linked_files', 'puma:config'
  # before 'check:linked_files', 'setup:copy_linked_master_key'
  # before 'check:linked_files', 'puma:nginx_config'
  after 'puma:restart', 'nginx:restart'
  # after 'deploy:starting', 'sidekiq:quiet'
  # after 'deploy:reverted', 'sidekiq:restart'
  # after 'deploy:published', 'sidekiq:restart'
  # after 'deploy:published', 'sidekiq:status'
end



# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, "/var/www/my_app_name"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# append :linked_files, "config/database.yml"

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
# set :keep_releases, 5

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure
