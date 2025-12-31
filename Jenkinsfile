// pipeline {
//   agent {
//     kubernetes {
//       defaultContainer 'jnlp'
//       yaml '''
// apiVersion: v1
// kind: Pod
// spec:
//   containers:
//   - name: jnlp
//     image: jenkins/inbound-agent:alpine-jdk17
//     workingDir: /home/jenkins/agent

//   - name: dind
//     image: docker:dind
//     securityContext:
//       privileged: true
//     env:
//       - name: DOCKER_TLS_CERTDIR
//         value: ""
//     args:
//       - "--insecure-registry=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
//     workingDir: /home/jenkins/agent

//   - name: kubectl
//     image: bitnami/kubectl:latest
//     command: ["cat"]
//     tty: true
//     workingDir: /home/jenkins/agent
//     env:
//       - name: KUBECONFIG
//         value: /kube/config
//     volumeMounts:
     
//       - name: kubeconfig-secret
//         mountPath: /kube/config
//         subPath: kubeconfig

//   - name: sonar
//     image: sonarsource/sonar-scanner-cli:latest
//     command: ["cat"]
//     tty: true

//   volumes:
//   - name: kubeconfig-secret
//     secret:
//       secretName: kubeconfig-secret
// '''
//     }
//   }

//   environment {
//     REGISTRY = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"

//     FE_IMAGE = "2401055/mindmate-fe"
//     BE_IMAGE = "2401055/mindmate-be"

//     TAG = "v${BUILD_NUMBER}"

//     VITE_API_URL = "http://mindmate-api.college.local"
//   }

//   stages {

//     stage("Checkout") {
//       steps {
//         checkout scm
//       }
//     }

//     stage("SonarQube Scan") {
//       steps {
//         container("sonar") {
//           sh "sonar-scanner"
//         }
//       }
//     }

//     stage("Build Frontend Image") {
//       steps {
//         container("dind") {
//           sh '''
//             docker build \
//               --build-arg VITE_API_URL=$VITE_API_URL \
//               -t $FE_IMAGE:$TAG \
//               -f MindMate-FE/Dockerfile .
//           '''
//         }
//       }
//     }

//     stage("Build Backend Image") {
//       steps {
//         container("dind") {
//           sh '''
//             docker build \
//               -t $BE_IMAGE:$TAG \
//               -f MindMate-BE/Dockerfile .
//           '''
//         }
//       }
//     }

//     stage("Push Images to Nexus") {
//       steps {
//         container("dind") {
//           sh '''
//             docker login $REGISTRY -u admin -p Changeme@2025

//             docker tag $FE_IMAGE:$TAG $REGISTRY/$FE_IMAGE:$TAG
//             docker push $REGISTRY/$FE_IMAGE:$TAG

//             docker tag $BE_IMAGE:$TAG $REGISTRY/$BE_IMAGE:$TAG
//             docker push $REGISTRY/$BE_IMAGE:$TAG
//           '''
//         }
//       }
//     }

    

//     stage("Deploy to Kubernetes") {
//       steps {
//         container("kubectl") {
//         dir("k8s") {
//         sh '''
//           kubectl apply -f fe-deployment.yaml
//           kubectl apply -f be-deployment.yaml
//           kubectl apply -f fe-service.yaml
//           kubectl apply -f be-service.yaml
//           kubectl apply -f ingress.yaml
//         '''
//       }
//     }
//   }
// }


//     stage("Verify Deployment") {
//       steps {
//         container("kubectl") {
//           sh '''
//             kubectl get pods -n 2401055
//             kubectl get svc -n 2401055
//             kubectl get ingress -n 2401055
//           '''
//         }
//       }
//     }
//   }

//   post {
//     success {
//       echo "✅ MindMate deployed successfully"
//     }
//     failure {
//       echo "❌ Pipeline failed – check logs"
//     }
//   }
// }



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

  # ✅ FIXED kubectl CONTAINER (ONLY CHANGE)
  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true
    securityContext:
      runAsUser: 0          # 🔥 REQUIRED FIX
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
    VITE_API_URL = "http://mindmate-api.imcc.com"
     DATABASE_URL = credentials('DATABASE_URL')
  SECRET_KEY = credentials('SECRET_KEY')
  ALGORITHM = credentials('ALGORITHM')
  ACCESS_TOKEN_EXPIRE_MINUTES = credentials('ACCESS_TOKEN_EXPIRE_MINUTES')
  REFRESH_TOKEN_EXPIRE_DAYS = credentials('REFRESH_TOKEN_EXPIRE_DAYS')

  MAIL_USERNAME = credentials('MAIL_USERNAME')
  MAIL_PASSWORD = credentials('MAIL_PASSWORD')
  MAIL_FROM = credentials('MAIL_FROM')
  MAIL_PORT = credentials('MAIL_PORT')
  MAIL_SERVER = credentials('MAIL_SERVER')
  MAIL_TLS = credentials('MAIL_TLS')
  MAIL_SSL = credentials('MAIL_SSL')

  GOOGLE_CLIENT_ID = credentials('GOOGLE_CLIENT_ID')
  GOOGLE_CLIENT_SECRET = credentials('GOOGLE_CLIENT_SECRET')
  GOOGLE_REDIRECT_URI = credentials('GOOGLE_REDIRECT_URI')

  OPENAI_API_KEY = credentials('OPENAI_API_KEY')
  CHAT_ENCRYPTION_KEY = credentials('CHAT_ENCRYPTION_KEY')
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
              -t mindmate-2401055-fe:latest \
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
              -t mindmate-2401055-be:latest \
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

            docker tag mindmate-2401055-fe:latest $REGISTRY/prathmesh/mindmate-2401055-fe:latest
            docker push $REGISTRY/prathmesh/mindmate-2401055-fe:latest

            docker tag mindmate-2401055-be:latest $REGISTRY/prathmesh/mindmate-2401055-be:latest
            docker push $REGISTRY/prathmesh/mindmate-2401055-be:latest
          '''
        }
      }
    }

    stage("Create / Update Kubernetes Secrets") {
  steps {
    container("kubectl") {
      sh '''
        kubectl create secret generic mindmate-secrets \
          -n 2401055 \
          --from-literal=DATABASE_URL="$DATABASE_URL" \
          --from-literal=SECRET_KEY="$SECRET_KEY" \
          --from-literal=ALGORITHM="$ALGORITHM" \
          --from-literal=ACCESS_TOKEN_EXPIRE_MINUTES="$ACCESS_TOKEN_EXPIRE_MINUTES" \
          --from-literal=REFRESH_TOKEN_EXPIRE_DAYS="$REFRESH_TOKEN_EXPIRE_DAYS" \
          --from-literal=MAIL_USERNAME="$MAIL_USERNAME" \
          --from-literal=MAIL_PASSWORD="$MAIL_PASSWORD" \
          --from-literal=MAIL_FROM="$MAIL_FROM" \
          --from-literal=MAIL_PORT="$MAIL_PORT" \
          --from-literal=MAIL_SERVER="$MAIL_SERVER" \
          --from-literal=MAIL_TLS="$MAIL_TLS" \
          --from-literal=MAIL_SSL="$MAIL_SSL" \
          --from-literal=GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" \
          --from-literal=GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" \
          --from-literal=GOOGLE_REDIRECT_URI="$GOOGLE_REDIRECT_URI" \
          --from-literal=OPENAI_API_KEY="$OPENAI_API_KEY" \
          --from-literal=CHAT_ENCRYPTION_KEY="$CHAT_ENCRYPTION_KEY" \
          --dry-run=client -o yaml | kubectl apply -f -
      '''
    }
  }
}




    stage("Deploy to Kubernetes") {
      steps {
        container("kubectl") {
          script{
          dir("k8s") {
            sh '''
              echo "Injecting image tag: $TAG"
              sed -i "s/{{TAG}}/$TAG/g" fe-deployment.yaml
              sed -i "s/{{TAG}}/$TAG/g" be-deployment.yaml
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
