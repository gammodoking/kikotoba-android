package net.snow69it.listeningworkout.common;

import android.content.Context;
import android.util.Log;

import net.snow69it.listeningworkout.article.Article;
import net.snow69it.listeningworkout.util.D;
import net.snow69it.listeningworkout.util.FileUtil;
import net.snow69it.listeningworkout.util.IOUtil;

import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;

/**
 * Created by raix on 2017/04/16.
 */

public class WorkingDirectory {

    private static WorkingDirectory instance = new WorkingDirectory();
    public static WorkingDirectory getInstance() {
        return instance;
    }

    public boolean hasAudioDownloaded(Context context, Article article) {
        File audioFile = createAudioDestinationFile(context, article);
        return audioFile.exists();
    }

    public File createAudioCache() throws IOException {
        return File.createTempFile("audio", "mp3");
    }

    public File createAudioDestinationFile(Context context, Article article) {
        File toDir = FileUtil.createPrivateExternalDir(context, "");
        return new File(toDir, getAudioPath(article));
    }

    private String getAudioPath(Article article) {
        return String.format("/audio/%s/%s.mp3", article.getId(), article.getLanguage());
    }

    public void deleteAudio(Context context) {
        File toDir = FileUtil.createPrivateExternalDir(context, "");
        File audioDir = new File(toDir, "/audio");
        try {
            for (File f : audioDir.listFiles()) {
                FileUtils.deleteDirectory(f);
            }
            D.d.d(toDir.getAbsolutePath());
            D.d.d(toDir.getPath());
            D.dir(toDir);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void createWorkingDirectory(Context context) {
        File sd = IOUtil.getPrivateExternalDir(context, "");
        FileUtil fileUtil = new FileUtil(context);
        try {
            fileUtil.copyFiles(null, "", sd);
        } catch (IOException e) {
            e.printStackTrace();
        }

        D.d.d(sd.getAbsolutePath());
        D.d.d(sd.getPath());
        D.dir(sd);
        Log.v("####### end ", "###########################");
    }

}
