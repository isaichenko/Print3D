class Article < ApplicationRecord
  belongs_to :user
  default_scope -> { order(created_at: :desc) }  
  validates  :title, presence: true,
                     length: { minimum: 5 }
  validates  :user_id, presence: true
  validates  :content, presence: true
end
