pipeline {
  agent {
    kubernetes {
      defaultContainer 'jnlp'
      yaml ''' (SAME POD YAML AS YOUR FRIEND) '''
    }
  }

  environment {
    REGISTRY = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
    TAG = "v${BUILD_NUMBER}"
    NAMESPACE = "2401055"
  }

  stages {

    stage("Checkout") {
      steps { checkout scm }
    }

    stage("Sonar Scan") {
      steps {
        container("sonar") {
          sh 'sonar-scanner'
        }
      }
    }

    stage("Build Backend Image") {
      steps {
        container("dind") {
          sh '''
            docker build -t mindmate-backend:$TAG -f MindMate-BE/Dockerfile .
            docker tag mindmate-backend:$TAG $REGISTRY/2401069/mindmate-backend:$TAG
            docker push $REGISTRY/2401069/mindmate-backend:$TAG
          '''
        }
      }
    }

    stage("Build Frontend Image") {
      steps {
        container("dind") {
          sh '''
            docker build \
              --build-arg VITE_API_URL=http://mindmate-backend:8000 \
              -t mindmate-frontend:$TAG \
              -f MindMate-FE/Dockerfile .

            docker tag mindmate-frontend:$TAG $REGISTRY/2401069/mindmate-frontend:$TAG
            docker push $REGISTRY/2401069/mindmate-frontend:$TAG
          '''
        }
      }
    }

    stage("Deploy to Kubernetes") {
      steps {
        container("kubectl") {
          sh '''
            sed "s|IMAGE_TAG|$TAG|g" k8s/backend-deployment.yaml | kubectl apply -n $NAMESPACE -f -
            sed "s|IMAGE_TAG|$TAG|g" k8s/frontend-deployment.yaml | kubectl apply -n $NAMESPACE -f -

            kubectl apply -n $NAMESPACE -f k8s/backend-service.yaml
            kubectl apply -n $NAMESPACE -f k8s/frontend-service.yaml
            kubectl apply -n $NAMESPACE -f k8s/ingress.yaml
          '''
        }
      }
    }
  }
}
