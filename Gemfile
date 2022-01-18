source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end


gem 'rails',                   '~> 5.1.4'
gem 'bcrypt',                  '3.1.11'
gem 'will_paginate',           '~> 3.1.0'
gem 'bootstrap-will_paginate', '1.0.0'
gem 'bootstrap',               '~> 4.0.0.beta3'
gem 'sprockets-rails',         :require => 'sprockets/railtie'
gem 'pg',                      '~> 0.11'
gem 'puma',                    '~> 4.0'
gem 'sass-rails',              '~> 5.0'
gem 'uglifier',                '>= 1.3.0'
gem 'jquery-rails'
# gem 'simple_form'
gem 'mail_form'
gem 'figaro'
gem "recaptcha", require: "recaptcha/rails"

gem 'coffee-rails', '~> 4.2'
gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 2.13'
  gem 'selenium-webdriver'
  gem 'sqlite3'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'

  # Gem for deploy
  gem 'capistrano', '~> 3.16',    require: false
  gem 'capistrano-rvm',           require: false
  gem 'capistrano-nginx',         require: false
  gem 'capistrano3-puma',         require: false
  gem 'capistrano-rails',         require: false
  gem 'capistrano-rails-db',      require: false
  gem 'capistrano-rails-console', require: false
  gem 'capistrano-upload-config', require: false
  gem 'sshkit-sudo',              require: false
  # gem 'capistrano-figaro-yml'     require: false
  # gem 'capistrano-sidekiq'        require: false # For gem sidekiq
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem 'execjs', '2.7.0'