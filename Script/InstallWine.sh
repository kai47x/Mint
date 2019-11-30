
#   Wine
        wget https://dl.winehq.org/wine-builds/Release.key
        sudo apt-key add Release.key
        sudo apt-add-repository https://dl.winehq.org/wine-builds/ubuntu/
        sudo dpkg --add-architecture i386
        sudo apt-get update
        sudo apt-get install --install-recommends wine-devel

        sudo apt install wine-stable
        sudo apt-get install wine32-development

#   PlayOnLinux
        sudo add-apt-repository ppa:noobslab/apps
        sudo apt-get update
        sudo apt-get install playonlinux

#  Winetricks
        sudo apt-get install winetricks 
