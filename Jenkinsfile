pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command:
    - cat
    tty: true
  - name: kubectl
    image: bitnami/kubectl:latest
    command:
    - cat
    tty: true
    securityContext:
      runAsUser: 0
      readOnlyRootFilesystem: false
    env:
    - name: KUBECONFIG
      value: /kube/config        
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig
  - name: dind
    image: docker:dind
    securityContext:
      privileged: true  # Needed to run Docker daemon
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""  # Disable TLS for simplicity
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json  # Mount the file directly here
  volumes:
  - name: docker-config
    configMap:
      name: docker-daemon-config
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
        dir("k8s") {
        sh '''
          kubectl apply -f fe-deployment.yaml
          kubectl apply -f be-deployment.yaml
          kubectl apply -f fe-service.yaml
          kubectl apply -f be-service.yaml
          kubectl apply -f ingress.yaml
        '''
      }
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
