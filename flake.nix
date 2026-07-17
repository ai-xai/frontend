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

      libxcb
      libX11
      libXext
      libSM
      libICE
      libGL

      glib
      fontconfig
      freetype
    ]);
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [
        uv
        nodejs
        pnpm
      ];

      LD_LIBRARY_PATH = libPath;
    };
  };
}
