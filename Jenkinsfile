pipeline {
    agent any

    environment {
        // URLs you provided
        SONARQUBE_URL = "http://sonarqube.imcc.com"
        NEXUS_URL = "nexus.imcc.com:8092"

        // Credential IDs
        SONAR_TOKEN = credentials('mindmate-sonar-token')
        NEXUS_CREDS = credentials('mindmate-nexus')

        // Image names
        BACKEND_IMAGE = "mindmate-backend"
        FRONTEND_IMAGE = "mindmate-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/prathmesh-ghatmal/MindMate.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scanner = tool name: 'mindmate-scanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                    withSonarQubeEnv('mindmate-sonar') {
                        sh """
                            ${scanner}/bin/sonar-scanner \
                              -Dsonar.projectKey=mindmate \
                              -Dsonar.sources=. \
                              -Dsonar.java.binaries=. \
                              -Dsonar.host.url=http://sonarqube.imcc.com
                        """
                    }
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                sh """
                    docker build -t ${NEXUS_URL}/${BACKEND_IMAGE}:latest ./MindMate-BE
                """
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh """
                    docker build -t ${NEXUS_URL}/${FRONTEND_IMAGE}:latest ./MindMate-FE
                """
            }
        }

        stage('Push Images to Nexus') {
            steps {
                sh """
                    echo "${NEXUS_CREDS_PSW}" | docker login ${NEXUS_URL} -u "${NEXUS_CREDS_USR}" --password-stdin
                    docker push ${NEXUS_URL}/${BACKEND_IMAGE}:latest
                    docker push ${NEXUS_URL}/${FRONTEND_IMAGE}:latest
                """
            }
        }

    }
}
