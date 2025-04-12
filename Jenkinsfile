pipeline {
    agent any

    environment {
        FRONTEND_DIR = 'FE'
        BACKEND_DIR = 'BE'
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Deploy') {
            steps {
                echo 'Stopping existing containers...'
                sh 'docker-compose down'

                echo 'Building and starting containers...'
                sh 'docker-compose up --build -d'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}
