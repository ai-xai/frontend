{
  description = "ai-xai frontend";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
  let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};

    libPath = pkgs.lib.makeLibraryPath (with pkgs; [
      stdenv.cc.cc.lib
      zlib

      xorg.libxcb
      xorg.libX11
      xorg.libXext
      xorg.libSM
      xorg.libICE
      libGL

      glib
      fontconfig
      freetype
    ]);
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [
        uv
      ];

      LD_LIBRARY_PATH = libPath;
    };
  };
}
