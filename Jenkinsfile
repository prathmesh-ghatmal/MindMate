pipeline {
  agent {
    kubernetes {
      defaultContainer 'jnlp'
      yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: jnlp
    image: jenkins/inbound-agent:alpine-jdk17
    workingDir: /home/jenkins/agent

  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""
    args:
      - "--insecure-registry=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
    workingDir: /home/jenkins/agent

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true
    workingDir: /home/jenkins/agent
    env:
      - name: KUBECONFIG
        value: /kube/config
    volumeMounts:
      - name: kubeconfig-secret
        mountPath: /kube/config
        subPath: kubeconfig

  - name: sonar
    image: sonarsource/sonar-scanner-cli:latest
    command: ["cat"]
    tty: true

  volumes:
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
    }
  }

  environment {
    REGISTRY = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"

    FE_IMAGE = "2401055/mindmate-fe"
    BE_IMAGE = "2401055/mindmate-be"

    TAG = "v${BUILD_NUMBER}"

    VITE_API_URL = "http://mindmate-api.college.local"
  }

  stages {

    stage("Checkout") {
      steps {
        checkout scm
      }
    }

    stage("SonarQube Scan") {
      steps {
        container("sonar") {
          sh "sonar-scanner"
        }
      }
    }

    stage("Build Frontend Image") {
      steps {
        container("dind") {
          sh '''
            docker build \
              --build-arg VITE_API_URL=$VITE_API_URL \
              -t $FE_IMAGE:$TAG \
              -f MindMate-FE/Dockerfile .
          '''
        }
      }
    }

    stage("Build Backend Image") {
      steps {
        container("dind") {
          sh '''
            docker build \
              -t $BE_IMAGE:$TAG \
              -f MindMate-BE/Dockerfile .
          '''
        }
      }
    }

    stage("Push Images to Nexus") {
      steps {
        container("dind") {
          sh '''
            docker login $REGISTRY -u admin -p Changeme@2025

            docker tag $FE_IMAGE:$TAG $REGISTRY/$FE_IMAGE:$TAG
            docker push $REGISTRY/$FE_IMAGE:$TAG

            docker tag $BE_IMAGE:$TAG $REGISTRY/$BE_IMAGE:$TAG
            docker push $REGISTRY/$BE_IMAGE:$TAG
          '''
        }
      }
    }

    

    stage("Deploy to Kubernetes") {
      steps {
        container("kubectl") {
          sh """
            kubectl apply -f k8s/fe-service.yaml
            kubectl apply -f k8s/be-service.yaml
            kubectl apply -f k8s/ingress.yaml
          """
        }
      }
    }

    stage("Verify Deployment") {
      steps {
        container("kubectl") {
          sh '''
            kubectl get pods -n 2401055
            kubectl get svc -n 2401055
            kubectl get ingress -n 2401055
          '''
        }
      }
    }
  }

  post {
    success {
      echo "✅ MindMate deployed successfully"
    }
    failure {
      echo "❌ Pipeline failed – check logs"
    }
  }
}
