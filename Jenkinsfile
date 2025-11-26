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
    command: ["cat"]
    tty: true

  - name: jnlp
    image: jenkins/inbound-agent:3345.v03dee9b_f88fc-1
    env:
    - name: JENKINS_AGENT_WORKDIR
      value: "/home/jenkins/agent"
    volumeMounts:
    - mountPath: "/home/jenkins/agent"
      name: workspace-volume

  volumes:
  - name: workspace-volume
    emptyDir: {}
'''
        }
    }

    stages {

        stage('CHECK') {
            steps {
                echo "Kubernetes pod working... Running SonarQube Scan next."
            }
        }

        stage('SonarQube Scan') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'mindmate-sonar', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=local-client-server \
                              -Dsonar.sources=. \
                              -Dsonar.host.url=http://localhost:9000 \
                              -Dsonar.login=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

    }
}
