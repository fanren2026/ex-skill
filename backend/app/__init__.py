from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
import redis
from config import config

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
redis_client = None

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})
    
    global redis_client
    redis_client = redis.from_url(app.config['REDIS_URL'])
    
    from app.routes import auth, users, courses, learning, community
    
    app.register_blueprint(auth.bp, url_prefix='/api/auth')
    app.register_blueprint(users.bp, url_prefix='/api/users')
    app.register_blueprint(courses.bp, url_prefix='/api/courses')
    app.register_blueprint(learning.bp, url_prefix='/api/learning')
    app.register_blueprint(community.bp, url_prefix='/api/community')
    
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'service': 'education-platform-api'}
    
    return app
