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
        stage('Notify Trigger') {
            steps {
                emailext (
                    subject: "🔔 GitHub Push Triggered: '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                    body: """Hey there 👋,

A push event has triggered the Jenkins pipeline.

Repository: ${env.GIT_URL}
Branch: ${env.GIT_BRANCH}
Build URL: ${env.BUILD_URL}

Cheers,
Jenkins Bot 🤖
""",
                    to: 'gareebiop@gmail.com'
                )
            }
        }

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
